import Layout from "@/Layouts/layout/layout.jsx";
import { Head } from "@inertiajs/react";
import CreateCompanyForm from "./Partials/CreateCompanyForm";

const CreateCompany = () => {
  return (
    <Layout>
      <Head title="Company" />
      <div className="grid">
        <div className="col-12">
          <div className="card">
            <CreateCompanyForm
              className="max-w-xl"
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CreateCompany;