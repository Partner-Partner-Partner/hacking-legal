import { Contract, Party, Section, Subsection, Clause } from "@/types/contract";

// Log to make sure this file is being loaded
console.log('Loading sampleContract.ts');

// Sample contract data that can be compared against the playbook
export const sampleContract: Contract = {
  title: "Service Agreement between Acme Corp and TechPartner Inc.",
  parties: [
    { name: "Acme Corporation" },
    { name: "TechPartner Inc." }
  ],
  sections: [
    {
      title: "Confidentiality",
      clauses: [
        {
          text: "\"Confidential Information\" means only information explicitly marked as \"CONFIDENTIAL\" at the time of disclosure. No oral disclosures shall be considered confidential."
        },
        {
          text: "The confidentiality obligations set forth in this Agreement shall terminate upon the expiration or termination of this Agreement."
        }
      ],
      subsections: []
    },
    {
      title: "Limitation of Liability",
      clauses: [
        {
          text: "Customer shall not be liable to Vendor for any consequential, incidental, indirect, exemplary, special, or punitive damages, including lost profits, revenue, data, or business opportunities."
        },
        {
          text: "Vendor's aggregate liability for any claims arising under or related to this Agreement shall not exceed the fees paid during the preceding three (3) months, while Customer shall have unlimited liability."
        }
      ],
      subsections: []
    },
    {
      title: "Termination",
      clauses: [
        {
          text: "Customer may terminate this Agreement at any time for any reason upon thirty (30) days written notice. Provider shall not have the right to terminate for convenience."
        }
      ],
      subsections: []
    },
    {
      title: "Payment Terms",
      clauses: [
        {
          text: "Customer shall pay all undisputed invoices within sixty (60) days of receipt."
        }
      ],
      subsections: [
        {
          title: "Late Payment",
          clauses: [
            {
              text: "Any payment not received within the payment terms will incur interest at a rate of 1.5% per month, or the maximum rate permitted by law, whichever is lower."
            }
          ]
        }
      ]
    },
    {
      title: "Governing Law",
      clauses: [
        {
          text: "This Agreement shall be governed by the laws of the State of California, without regard to its conflict of laws principles."
        }
      ],
      subsections: []
    }
  ]
};

// Add a check to verify data at module load time
console.log(`sampleContract contains ${sampleContract.sections.length} sections`);

// Export a default as fallback in case named export isn't working
export default sampleContract;
