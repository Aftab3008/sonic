export const formatTime = (seconds: number) => {
  "worklet" // Allows this to run on the UI thread

  if (!seconds || isNaN(seconds) || seconds < 0) {
    return "0:00";
  }

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};
