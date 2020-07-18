type StateArgsType = {
  payload: {
    [key: string]: any;
  };
};

const model = {
  reducers: {
    updateState(state: any, { payload }: StateArgsType): any {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export { model };
