export const LOCAL_STORAGE_SPLIT_SIZES_KEY = 'demoit-split-sizes-v2';

export default function screenSplit() {
  const isLocalStorageAvailable = typeof window.localStorage !== 'undefined';
  const defaultValues = [ 25, 75, 75, 25 ];
  const getSizes = () => {
    if (isLocalStorageAvailable) {
      let valueInStorage = localStorage.getItem(LOCAL_STORAGE_SPLIT_SIZES_KEY);

      if (valueInStorage) {
        valueInStorage = valueInStorage.split(',');
        if (valueInStorage.length === 4) {
          return valueInStorage.map(Number);
        }
      }
    }
    return defaultValues;
  }
  const [ A, B, C, D ] = getSizes();
  const mainSplit = Split(['.left', '.right'], {
      sizes: [ A, B ],
      gutterSize: 4
  });
  const leftSplit = Split(['.output', '.console'], {
    sizes: [ C, D ],
    gutterSize: 4,
    direction: 'vertical'
  });
  isLocalStorageAvailable && setInterval(() => {
    localStorage.setItem(
      LOCAL_STORAGE_SPLIT_SIZES_KEY,
      mainSplit.getSizes().join(',') + ',' + leftSplit.getSizes().join(',')
    )
  }, 4000);
}