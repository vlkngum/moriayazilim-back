/*
  Warnings:

  - You are about to drop the `Blog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Paragraph` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Blog" DROP CONSTRAINT "Blog_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Paragraph" DROP CONSTRAINT "Paragraph_blogId_fkey";

-- DropTable
DROP TABLE "Blog";

-- DropTable
DROP TABLE "Paragraph";
