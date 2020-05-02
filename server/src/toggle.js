export const toggle = (appoint) => async () => {
  await appoint.command({ method: "toggle", params: [] });
};
