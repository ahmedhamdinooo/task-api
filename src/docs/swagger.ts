import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Eng Tasks API",
      version: "1.0.0",
      description: "Mini Product Studio — Task Management API",
    },
    servers: [{ url: "/api/v1" }],
    tags: [
      { name: "Tasks", description: "Task management endpoints" },
      { name: "Comments", description: "Comment endpoints" },
      { name: "Users", description: "User endpoints" },
    ],
  },
  apis: ["./src/modules/**/*.routes.ts"],
});