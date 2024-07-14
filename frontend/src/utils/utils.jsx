import { axiosReq } from "../api/axiosDefaults";
import { jwtDecode } from "jwt-decode";

export const fetchMoreData = async (resource, setResource) => {
  try {
    const relativeURL = getRelativeURL(resource.next);
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

export const setTokenTimestamp = (data) => {
  const refreshTokenTimestamp = jwtDecode(data?.refresh).exp;
  localStorage.setItem("refreshToken-timestamp", refreshTokenTimestamp);
};

export const shouldRefreshToken = () => {
  return !!localStorage.getItem("refreshToken-timestamp");
};

export const removeTokenTimestamp = () => {
  localStorage.removeItem("refreshToken-timestamp");
};
