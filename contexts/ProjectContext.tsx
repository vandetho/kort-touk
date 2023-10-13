import React from 'react';
import { useSearch } from '@contexts/SearchContext';
import Project from '@models/Project';
import { useDatabaseConnection } from '@contexts/DatabaseConnectionContext';
import { usePaymentMethods } from '@contexts/PaymentMethodContext';
import { useCategories } from '@contexts/CategoryContext';

export const ProjectContext = React.createContext<{
    project: Project | undefined;
    projects: Project[];
    index: number | undefined;
    onSelect: (project: Project | undefined, index: number | undefined) => void;
    addProject: (project: Project) => void;
    onUpdate: (projects: Project[]) => void;
    refreshCurrentProject: () => void;
}>({
    project: undefined,
    projects: [],
    index: undefined,
    onSelect: (project: Project | undefined, index: number | undefined) => {
        console.log({ project, index });
    },
    addProject: (project: Project) => {
        console.log({ project });
    },
    onUpdate: (projects: Project[]) => {
        console.log({ projects });
    },
    refreshCurrentProject: () => {
        console.log();
    },
});

export const ProjectProvider: React.FunctionComponent = ({ children }) => {
    const [state, setState] = React.useState<{
        projects: Project[];
        project: Project | undefined;
        index: number | undefined;
    }>({
        project: undefined,
        index: undefined,
        projects: [],
    });
    const { from, category, to, name, paymentMethod } = useSearch();
    const { projectRepository, transactionRepository } = useDatabaseConnection();
    const { onUpdateSelectedCategories } = useCategories();
    const { onUpdateSelectedPaymentMethods } = usePaymentMethods();

    const loadData = React.useCallback(async () => {
        projectRepository.getAll().then(async (projects) => {
            const projectTracks: { [key: string]: string } = {};
            const newProjects: { [key: string]: Project } = {};
            for (let i = 0; i < projects.length; i++) {
                if (projects[i].trackTransaction) {
                    projectTracks[i] = projects[i].id;
                    projects[i].balances = 0;
                }
                newProjects[projects[i].id] = projects[i];
            }
            const keys = Object.keys(projectTracks);
            if (keys.length) {
                const balances = await transactionRepository.getSumByCriteria(
                    {
                        from,
                        paymentMethod: paymentMethod?.id,
                        name,
                        to,
                        category: category?.id,
                    },
                    Object.values(projectTracks),
                );
                balances.forEach((balance) => {
                    newProjects[balance.projectId].balances = balance.amount || 0;
                });
            }
            setState((prevState) => ({ ...prevState, projects: Object.values(newProjects) }));
        });
    }, [category, from, name, paymentMethod, projectRepository, to, transactionRepository]);

    React.useEffect(() => {
        (async () => await loadData())();
    }, [loadData]);

    const addProject = React.useCallback(
        (project: Project) => {
            const projects = [...state.projects];
            projects.push(project);
            setState((prevState) => ({ ...prevState, project, projects }));
        },
        [state.projects],
    );

    const onSelect = React.useCallback(
        (project: Project | undefined, index: number | undefined) => {
            if (project) {
                onUpdateSelectedCategories(project.categories);
                onUpdateSelectedPaymentMethods(project.paymentMethods);
            }
            setState((prevState) => ({ ...prevState, project, index }));
        },
        [onUpdateSelectedCategories, onUpdateSelectedPaymentMethods],
    );

    const onUpdate = React.useCallback((projects: Project[]) => {
        setState((prevState) => ({ ...prevState, projects }));
    }, []);

    const refreshCurrentProject = React.useCallback(async () => {
        const project = { ...state.project };
        const projects = [...state.projects];
        if (project.trackTransaction) {
            const balances = await transactionRepository.getSumByCriteria(
                {
                    from,
                    paymentMethod: paymentMethod?.id,
                    name,
                    to,
                    category: category?.id,
                },
                [state.project?.id],
            );
            balances.forEach((balance) => {
                project.balances = balance.amount || 0;
            });
        }
        projects[state.index] = project;
        setState((prevState) => ({ ...prevState, project, projects: projects }));
    }, [
        category?.id,
        from,
        name,
        paymentMethod?.id,
        state.index,
        state.project,
        state.projects,
        to,
        transactionRepository,
    ]);

    return (
        <ProjectContext.Provider value={{ ...state, addProject, onSelect, refreshCurrentProject, onUpdate }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProjects = () => {
    return React.useContext(ProjectContext);
};
