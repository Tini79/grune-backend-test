import Layout from "@/Layouts/layout/layout.jsx";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Link } from "@inertiajs/react";

const Company = ({ companies }) => {
  return (
    <Layout>
      <div className="card mb-0">
        <div className="mb-2">
          <Link href={route('company.create')}>Create Company</Link>
        </div>
        <DataTable value={companies} tableStyle={{ minWidth: '50rem' }}>
          <Column field="name" header="Name"></Column>
          <Column field="email" header="Email"></Column>
          <Column field="postcode" header="Postcode"></Column>
          <Column field="prefecture" header="Prefecture"></Column>
        </DataTable>
      </div>
    </Layout>
  )
}

export default Company;