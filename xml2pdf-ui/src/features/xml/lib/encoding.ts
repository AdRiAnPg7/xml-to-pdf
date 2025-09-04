export const readFileAsText = async (
  file: File,
  encoding: "utf-8" | "latin1" = "utf-8"
): Promise<string> => {
  const buf = await file.arrayBuffer();
  const dec = new TextDecoder(encoding === "latin1" ? "latin1" : "utf-8");
  return dec.decode(new Uint8Array(buf));
};
