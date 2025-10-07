import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from '@/layouts/AppLayout';
import DashboardView from '@/views/DashboardView'
import EditProjectView from '@/views/EditProjectView';
import CreateProjectView from '@/views/CreateProjectView';
import ProjectDetailsView from '@/views/ProjectDetailsView';

export default function Router() {
    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<DashboardView />} index />
                    <Route path="/projects" element={<DashboardView />} />
                    <Route path="/projects/create" element={<CreateProjectView />} />
                    <Route path="/projects/:projectId" element={<ProjectDetailsView />} />
                    <Route path="/projects/:projectId/edit" element={<EditProjectView />} />
                </Route>

            </Routes>
        </BrowserRouter>
    )

}