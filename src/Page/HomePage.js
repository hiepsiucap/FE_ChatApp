/** @format */
import { Hero } from "../component";

const HomePage = () => {
  console.log(process.env.REACT_APP_API_URL);
  return <Hero></Hero>;
};
export default HomePage;
