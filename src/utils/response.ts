// import { CacheManager } from '@midwayjs/cache';

export const response200 = (data: any) => ({
  code: 200,
  data,
});

export const response404 = (message: string) => ({
  code: 404,
  message,
});

export const response403 = (message: string) => ({
  code: 403,
  message,
});

export const response401 = (message: string) => ({
  code: 401,
  message,
});

export const response400 = (message: string) => ({
  code: 400,
  message,
});

export const response500 = (message: string) => ({
  code: 500,
  message,
});

// export const getCacheFirstObjectResource = async (
//   cacheInstance: CacheManager,
//   cacheKey: string,
//   fetchRemote,
//   ttl: number
//   // eslint-disable-next-line @typescript-eslint/ban-types
// ): Promise<object> => {
//   const cacheResult = await cacheInstance.get(cacheKey);
//   if (cacheResult && typeof cacheResult === 'object') {
//     return { ...cacheResult, from: 'cache' };
//   }
//   const remoteResult = await fetchRemote;
//   cacheInstance.set(cacheKey, remoteResult, { ttl });
//   return { ...remoteResult, from: 'remote' };
// };
//
// export const getCacheFirstArrayResource = async (
//   cacheInstance: CacheManager,
//   cacheKey: string,
//   fetchRemote,
//   ttl: number
// ): Promise<{ data: any; from: string }> => {
//   const cacheResult = await cacheInstance.get(cacheKey);
//   if (cacheResult && typeof cacheResult === 'object') {
//     return { data: cacheResult, from: 'cache' };
//   }
//   const remoteResult = await fetchRemote;
//   cacheInstance.set(cacheKey, remoteResult, { ttl });
//   return { data: remoteResult, from: 'remote' };
// };
