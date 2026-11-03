// Gera uma miniatura JPEG leve para caber no localStorage do protótipo.
// No sistema real o arquivo original iria para o Armazenamento de Arquivos (diagrama de componentes).
export async function createPhotoPreview(file: File, maxSize = 800): Promise<string | undefined> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    return canvas.toDataURL('image/jpeg', 0.72);
  } catch {
    return undefined;
  }
}
