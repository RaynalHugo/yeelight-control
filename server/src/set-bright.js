export const setBright = (appoint) => async (
  intensity,
  mode = "smooth",
  delay = 500
) => {
  const numericalIntensity = Number(intensity);
  await appoint.command({
    method: "set_bright",
    params: [numericalIntensity, mode, delay],
  });
};
