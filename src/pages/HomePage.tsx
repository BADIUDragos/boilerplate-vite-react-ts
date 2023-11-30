import { useGetTestStringsQuery } from "../store/apis/testApi";

const HomePage = () => {
  
  const { data, error, isLoading } = useGetTestStringsQuery(null);

  return (
    <div>homepage</div>
  );
};

export default HomePage;
