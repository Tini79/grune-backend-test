import Layout from "@/Layouts/layout/layout.jsx";
import { Head } from "@inertiajs/react";
import CreateCompany from "./Partials/CreateCompanyForm";

const Company = () => {
  return (
    <Layout>
      <Head title="Company" />
      <div className="grid">
        <div className="col-12">
          <div className="card">
            <CreateCompany
              className="max-w-xl"
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Company;