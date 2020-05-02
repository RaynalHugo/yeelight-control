export const setRgb = (appoint) => async (
  color,
  mode = "sudden",
  delay = 0
) => {
  const hexColor = Number(color);
  await appoint.command({ method: "set_rgb", params: [hexColor, mode, delay] });
};
