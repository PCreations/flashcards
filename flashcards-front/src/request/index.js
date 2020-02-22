export const createRequestState = ({ requestName, defaultData = [] } = {}) => {
  const REQUEST_STARTED = `${requestName} has started`;
  const REQUEST_ENDED = `${requestName} has ended`;
  const IDLE_STATUS = "idle";
  const LOADING_STATUS = "loading";
  const SUCCESS_STATUS = "success";
  const FAIL_STATUS = "fail";

  const defaultState = {
    status: IDLE_STATUS,
    data: defaultData,
    error: null
  };

  const idleRequestReducer = (requestState, action) => {
    if (action.type === REQUEST_STARTED) {
      return {
        ...requestState,
        status: LOADING_STATUS
      };
    }
    return requestState;
  };

  const loadingRequestReducer = (requestState, action) => {
    if (action.type === REQUEST_ENDED) {
      return action.error
        ? {
            ...requestState,
            status: FAIL_STATUS,
            error: action.error
          }
        : {
            ...requestState,
            status: SUCCESS_STATUS,
            data: action.payload.data,
            error: null
          };
    }
    return requestState;
  };

  const requestReducer = (requestState = defaultState, action) => {
    switch (requestState.status) {
      case IDLE_STATUS:
        return idleRequestReducer(requestState, action);
      case LOADING_STATUS:
        return loadingRequestReducer(requestState, action);
      default:
        return requestState;
    }
  };

  const requestStarted = () => ({
    type: REQUEST_STARTED
  });

  const requestEnded = ({ data, error }) =>
    error
      ? {
          type: REQUEST_ENDED,
          error
        }
      : {
          type: REQUEST_ENDED,
          payload: { data }
        };

  const isRequestLoading = requestState =>
    requestState.status === LOADING_STATUS;

  const getData = requestState => requestState.data;

  const getRequestError = requestState => requestState.error;

  const hasRequestEnded = requestState =>
    requestState.status === SUCCESS_STATUS ||
    requestState.status === FAIL_STATUS;

  return {
    defaultState,
    REQUEST_ENDED,
    requestReducer,
    requestStarted,
    requestEnded,
    isRequestLoading,
    getData,
    getRequestError,
    hasRequestEnded
  };
};
