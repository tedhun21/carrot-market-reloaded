"use server";

export async function handleForm(prevState: any, formData: FormData) {
  return {
    error: ["wrong password", "password too short"],
  };
}
