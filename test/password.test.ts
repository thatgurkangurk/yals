import { test, expect } from "bun:test";
import { hashPassword, verifyPassword } from "../src/lib/password";

test("password hashing + verification", async () => {
   const password = "super-duper-s3cur3-p@$$w0rd";
   const hash = await hashPassword(password);

   expect(await verifyPassword(hash, password)).toBe(true)
});

//test("password verification works", async () => {
//    expect(await verifyPassword("$argon2id$v=19$m=65536,t=2,p=1$tFq+9AVr1bfPxQdh6E8DQRhEXg/M/SqYCNu6gVdRRNs$GzJ8PuBi+K+BVojzPfS5mjnC8OpLGtv8KJqF99eP6a4", "super-secure-pa$$word")).toBe(true);
//    expect(await verifyPassword("$argon2id$v=19$m=65536,t=2,p=1$tFq+9AVr1bfPxQdh6E8DQRhEXg/M/SqYCNu6gVdRRNs$GzJ8PuBi+K+BVojzPfS5mjnC8OpLGtv8KJqF99eP6a4", "not-correct-pa$$word")).toBe(false);
//})