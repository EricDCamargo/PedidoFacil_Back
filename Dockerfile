# Etapa de desenvolvimento
FROM node:20 AS builder

# Definir o diretório de trabalho
WORKDIR /app

# Copiar os arquivos de configuração do projeto
COPY package.json yarn.lock ./

# Instalar dependências de desenvolvimento
RUN yarn install

# Copiar o restante do código do projeto
COPY . .

# Gerar os arquivos do Prisma
RUN yarn prisma generate

# Compilar o TypeScript
RUN yarn build

# Etapa de produção
FROM node:20 AS production

# Definir o ambiente como produção
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Definir o diretório de trabalho
WORKDIR /app

# Copiar apenas os arquivos de configuração para instalar somente dependências de produção
COPY package.json yarn.lock ./
RUN yarn install --production

# Copiar os arquivos compilados da etapa de desenvolvimento
COPY --from=builder /app/dist ./dist

# Copiar o Prisma Client gerado (geralmente na pasta node_modules/.prisma e @prisma)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copiar os arquivos do Prisma
COPY --from=builder /app/prisma ./prisma

# Comando para iniciar o servidor
CMD ["node", "dist/server.js"]