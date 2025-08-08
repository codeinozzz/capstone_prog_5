export const Either = {
  success: (data) => ({
    isSuccess: true,
    data: data,
    
    onSuccess: (fn) => {
      fn(data);
      return Either.success(data);
    },
    onError: (fn) => Either.success(data)
  }),

  error: (errorMsg) => ({
    isSuccess: false,
    error: errorMsg,
    
    onSuccess: (fn) => Either.error(errorMsg),
    onError: (fn) => {
      fn(errorMsg);
      return Either.error(errorMsg);
    }
  })
};