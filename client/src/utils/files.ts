export const determineFileType = (file: File): 'file' | 'image' => {
  if (file.type.includes('text')) {
    return 'file'
  }

  return 'image';
}