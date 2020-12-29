export const determineFileType = (file: File): 'text' | 'image' => {
  if (file.name.includes('text')) {
    return 'text'
  }

  return 'image';

  //! FIXME
  // if (file.name.includes('image')) {
  //   return 'image'
  // }
}