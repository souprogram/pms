import { useParams } from "react-router";

export const Blog = () => {
  const params = useParams<{ id: string }>();

  return (
    <div className="flex flex-col gap-4">
      <div className="">post is here </div>

      <div className="">param id: {params.id}</div>
    </div>
  );
};
