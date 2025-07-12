import { useAppStateContext } from "../../RoomsDisplay";

const ErrorDisplay = () => {
  const { appState, setAppState } = useAppStateContext();

  const handleClose = () => {
    setAppState((prev)=>({
      ...prev,
      error: null,
    }));
  };

  return (
    <div className='error-display'>
      { appState.error !== null &&
        <>
          {appState.error}
          <button
            className='error-display__close'
            onClick={()=> handleClose()}
          >
            Close
          </button>
        </>
      }
    </div>
  );
};

export default ErrorDisplay;