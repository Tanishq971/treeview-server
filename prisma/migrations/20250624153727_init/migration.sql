-- CreateTable
CREATE TABLE "FileTree" (
    "id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FileTree_pkey" PRIMARY KEY ("id")
);
