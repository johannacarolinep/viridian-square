import { axiosReq } from "../api/axiosDefaults";

export const fetchMoreData = async (resource, setResource) => {
  try {
    const relativeURL = getRelativeURL(resource.next);
    console.log("Relative", relativeURL);
    const { data } = await axiosReq.get(relativeURL);
    setResource((prevResource) => ({
      ...prevResource,
      next: data.next,
      results: data.results.reduce((acc, cur) => {
        return acc.some((accResult) => accResult.id === cur.id)
          ? acc
          : [...acc, cur];
      }, prevResource.results),
    }));
  } catch (err) {
    console.log("Error fetching more data:", err);
  }
};

const getRelativeURL = (fullURL) => {
  const urlParts = fullURL.split("/");
  return `/${urlParts.slice(3).join("/")}`;
};
