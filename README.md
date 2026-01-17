# 👵👴 Elder Care Sync

> Sistema de coordenação de cuidados familiares focado em dispositivos móveis e performance serverless.

![Vercel](https://img.shields.io/badge/Hosted_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14_App_Router-black?style=for-the-badge&logo=next.js&logoColor=white)
![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind](https://img.shields.io/badge/UI-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🎯 Objetivo do Projeto

Aplicação web progressiva (PWA) desenvolvida para gerenciar a rotina de cuidados de dois idosos. O foco principal é a usabilidade **mobile-first**, permitindo que familiares coordenem tarefas diárias, consultas e medicamentos através de um calendário compartilhado com sistema de atribuição de responsabilidades.

## 🏗 Arquitetura & Tech Stack

A arquitetura foi desenhada especificamente para o ecossistema da **Vercel**, priorizando o baixo custo (Hobby Tier), performance em Edge e cold starts rápidos.

| Componente | Tecnologia Escolhida | Justificativa Arquitetural |
| :--- | :--- | :--- |
| **Framework** | Next.js 14+ (App Router) | Padrão Vercel. Server Components para reduzir o bundle JS no mobile. |
| **Linguagem** | TypeScript | Tipagem estrita para manutenibilidade e segurança do código. |
| **Database** | Supabase (PostgreSQL) | Banco relacional robusto, conexão via Pooler compatível com Serverless Functions. |
| **ORM** | Prisma | Facilidade de modelagem e tipagem segura entre DB e Frontend. |
| **UI System** | Tailwind CSS + Shadcn/ui | Componentes leves, acessíveis e customizáveis. Foco total em UI Mobile. |
| **Auth** | Clerk ou NextAuth | Autenticação segura e simples de integrar com Middleware do Next.js. |

## 🗄️ Modelagem de Dados (Schema)

O banco de dados foi modelado para suportar alta concorrência de leitura e escrita atômica nas tarefas.

```prisma
// schema.prisma

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  avatarUrl String?
  tasks     Task[]   @relation("TaskAssignee")
  createdAt DateTime @default(now())
}

model ElderlyProfile {
  id             String   @id @default(cuid())
  name           String
  needs          String?  // Ex: "Diabético", "Cadeirante"
  emergencyPhone String?
  tasks          Task[]
}

model Task {
  id          String         @id @default(cuid())
  title       String
  description String?
  date        DateTime
  isCompleted Boolean        @default(false)
  
  // Relacionamento: "Assign to Me"
  assigneeId  String?
  assignee    User?          @relation("TaskAssignee", fields: [assigneeId], references: [id])
  
  elderlyId   String
  elderly     ElderlyProfile @relation(fields: [elderlyId], references: [id])

  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
}
