import { useEffect } from "react";
import ProjectDetails from "../components/ProjectDetails";
import ProjectForm from "../components/ProjectForm";
import { useAuthContext } from "../hooks/useAuthContext";
import { useProjectsContext } from "../hooks/useProjectsContext";

const Home = () => {
  const { projects, dispatch } = useProjectsContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const getAllProjects = async () => {
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/projects`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const json = await res.json();

      if (res.ok) {
        dispatch({ type: "SET_PROJECTS", payload: json });
      }
    };

    if (user) {
      getAllProjects();
    }
  }, [dispatch, user]);

  return (
    <div className='home container mx-auto py-10 min-h-screen grid gap-10 grid-cols-1 md:grid-cols-2'>
      {projects.length < 1 ? (
        <div className='left'>
          <h2 className='text-3xl text-sky-400 mb-10'>
            No project available here!
          </h2>
        </div>
      ) : (
        projects.map((project) => (
          <ProjectDetails key={project._id} project={project} />
        ))
      )}
    </div>
  );
};

export default Home;
