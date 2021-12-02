-- CreateTable
CREATE TABLE "Ruling" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "mtgId" INTEGER NOT NULL,
    CONSTRAINT "Ruling_mtgId_fkey" FOREIGN KEY ("mtgId") REFERENCES "Mtg" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Mtg" (
    "name" TEXT NOT NULL,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "color" TEXT,
    "text" TEXT,
    "iamgeUrl" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Mtg_name_key" ON "Mtg"("name");
