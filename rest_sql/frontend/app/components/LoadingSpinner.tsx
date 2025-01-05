import { Audio } from "react-loader-spinner";

const LoadingSpinner = () => {
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-muted">
      <Audio
        height={60}
        width={60}
        color="grey"
        ariaLabel="Loading"
        wrapperClass="text-center"
      />
      <p className="mt-3">Loading</p>
    </div>
  );
};

export default LoadingSpinner;
