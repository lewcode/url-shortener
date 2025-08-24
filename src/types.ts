import z from "zod";

export const shortenBody =  z.object({
    url: z.string()
  })