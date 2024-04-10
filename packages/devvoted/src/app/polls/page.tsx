"use client";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Link from "next/link";

type Poll = {
  id: string;
  title: string;
  submitter: string;
  category: string;
};

const PollsOverviewPage = () => {
  const polls: Poll[] = [
    {
      title: "Doop die doop, what is this troep?",
      submitter: "Matthijs Groen",
      category: "Test",
      id: "1231-1231",
    },
  ];
  return (
    <div>
      <h1>Polls Overview</h1>

      <DataTable<Poll[]> value={polls} showGridlines stripedRows>
        <Column field="title" header="Title"></Column>
        <Column field="submitter" header="Submitted By"></Column>
        <Column field="category" header="Category"></Column>
        <Column
          header=""
          body={(row: Poll) => <Link href={`/polls/${row.id}`}>Open</Link>}
        ></Column>
      </DataTable>
    </div>
  );
};

export default PollsOverviewPage;
