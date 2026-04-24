-- CreateTable
CREATE TABLE "Participante" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "chavePix" TEXT NOT NULL,
    "tipoPix" TEXT NOT NULL,
    "cotas" INTEGER NOT NULL DEFAULT 1,
    "bolaoId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Participante_bolaoId_fkey" FOREIGN KEY ("bolaoId") REFERENCES "Bolao" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Jogo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "numeros" TEXT NOT NULL,
    "dataSorteio" DATETIME NOT NULL,
    "quantNumeros" INTEGER NOT NULL DEFAULT 6,
    "origem" TEXT NOT NULL DEFAULT 'online',
    "numeroConcurso" TEXT,
    "bolaoId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Jogo_bolaoId_fkey" FOREIGN KEY ("bolaoId") REFERENCES "Bolao" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Jogo" ("bolaoId", "createdAt", "dataSorteio", "id", "numeros", "updatedAt") SELECT "bolaoId", "createdAt", "dataSorteio", "id", "numeros", "updatedAt" FROM "Jogo";
DROP TABLE "Jogo";
ALTER TABLE "new_Jogo" RENAME TO "Jogo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
