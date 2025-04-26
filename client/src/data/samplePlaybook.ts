import { ContractSection } from "@/types/playbook";

// Log to make sure this file is being loaded
console.log('Loading samplePlaybook.ts');

// Sample Contract Playbook Data
export const samplePlaybook: ContractSection[] = [
  {
    id: "confidentiality",
    title: "Confidentiality",
    description: "Clauses governing the protection and disclosure of confidential information.",
    clauses: [
      {
        id: "conf-1",
        title: "Definition of Confidential Information",
        mostFavorable: "\"Confidential Information\" means all non-public information, in any form, furnished or made available directly or indirectly by one party (the \"Disclosing Party\") to the other party (the \"Receiving Party\") that is marked, designated, or otherwise identified as confidential. Confidential Information shall include, but is not limited to, business plans, financial information, product designs, customer lists, marketing strategies, and any information derived from such information.",
        balanced: "\"Confidential Information\" means all non-public information, in any form, furnished or made available directly or indirectly by one party to the other party that is marked or designated as confidential. For information disclosed orally, it will be considered Confidential Information only if identified as confidential at the time of disclosure and summarized in writing within 30 days of disclosure.",
        acceptable: "\"Confidential Information\" means only information explicitly marked as \"CONFIDENTIAL\" at the time of disclosure. No oral disclosures shall be considered confidential.",
        unacceptable: "\"Confidential Information\" means only information explicitly marked as \"CONFIDENTIAL\" at the time of disclosure. No oral disclosures shall be considered confidential.",
        arguments: {
          toMostFavorable: "In our industry, information exchanged often contains sensitive business insights that might not always be explicitly marked. A broader definition provides mutual protection against inadvertent disclosure and reduces administrative burden of marking every document.",
          toBalanced: "While we understand your concern about clearly identifying confidential information, requiring written confirmation for all oral disclosures within a short timeframe creates significant administrative burden. Let's find a middle ground that protects both parties without excessive paperwork.",
          fromUnacceptable: "This narrow definition creates substantial risk for our business. Information shared during meetings or calls would have no protection at all, and we couldn't proceed with a relationship that leaves our sensitive information so exposed."
        }
      },
      {
        id: "conf-2",
        title: "Duration of Confidentiality Obligations",
        mostFavorable: "The confidentiality obligations set forth in this Agreement shall survive the termination or expiration of this Agreement and remain in effect perpetually.",
        balanced: "The confidentiality obligations set forth in this Agreement shall survive the termination or expiration of this Agreement and remain in effect for five (5) years thereafter.",
        acceptable: "The confidentiality obligations set forth in this Agreement shall terminate upon the expiration or termination of this Agreement.",
        unacceptable: "The confidentiality obligations set forth in this Agreement shall terminate upon the expiration or termination of this Agreement.",
        arguments: {
          toMostFavorable: "Some of the information we'll be sharing retains its competitive value indefinitely. Trade secrets and proprietary manufacturing processes don't lose their sensitivity with time and need perpetual protection.",
          toBalanced: "While perpetual obligations might seem burdensome, consider that most confidential information maintains its sensitivity for many years. A five-year term after termination represents a reasonable compromise that acknowledges the long-term value of the information.",
          fromUnacceptable: "Terminating confidentiality obligations when the contract ends would effectively make our intellectual property freely available the moment we stop working together. This essentially penalizes us for any change in our business relationship."
        }
      }
    ]
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    description: "Clauses defining the extent and limitations of liability between parties.",
    clauses: [
      {
        id: "liab-1",
        title: "Exclusion of Consequential Damages",
        mostFavorable: "Neither party shall be liable to the other or any third party for any consequential, incidental, indirect, exemplary, special, or punitive damages, including lost profits, revenue, data, or business opportunities, regardless of whether such damages are based on contract, tort, strict liability, or any other legal theory, even if such party has been advised of the possibility of such damages.",
        balanced: "Except for breaches of confidentiality obligations and intellectual property rights, neither party shall be liable to the other or any third party for any consequential, incidental, indirect, exemplary, special, or punitive damages, including lost profits, revenue, data, or business opportunities.",
        acceptable: "Customer shall not be liable to Vendor for any consequential, incidental, indirect, exemplary, special, or punitive damages, including lost profits, revenue, data, or business opportunities. [One-sided limitation in favor of customer only]",
        unacceptable: "Customer shall not be liable to Vendor for any consequential, incidental, indirect, exemplary, special, or punitive damages, including lost profits, revenue, data, or business opportunities. [One-sided limitation in favor of customer only]",
        arguments: {
          toMostFavorable: "A mutual limitation on consequential damages creates a balanced playing field that protects both our interests equally. This reciprocity is a fundamental principle of fair contracting and risk allocation.",
          toBalanced: "We can accept certain carve-outs for confidentiality and IP breaches, but these must apply equally to both parties. Any imbalance in liability protection creates uneven risk exposure that's difficult to quantify.",
          fromUnacceptable: "One-sided liability limitations fundamentally imbalance our relationship. We're being asked to accept unlimited liability while you enjoy full protection - this contradicts basic principles of mutual risk management and fairness."
        }
      },
      {
        id: "liab-2",
        title: "Cap on Liability",
        mostFavorable: "The aggregate liability of either party for any claims arising under or related to this Agreement shall not exceed the fees paid or payable under this Agreement during the twelve (12) months preceding the claim.",
        balanced: "The aggregate liability of either party for any claims arising under or related to this Agreement shall not exceed two times (2x) the fees paid or payable under this Agreement during the twelve (12) months preceding the claim.",
        acceptable: "Vendor's aggregate liability for any claims arising under or related to this Agreement shall not exceed the fees paid during the preceding three (3) months, while Customer shall have unlimited liability.",
        unacceptable: "Vendor's aggregate liability for any claims arising under or related to this Agreement shall not exceed the fees paid during the preceding three (3) months, while Customer shall have unlimited liability.",
        arguments: {
          toMostFavorable: "A cap based on 12 months of fees is standard industry practice and provides a clear, reasonable limit that's proportional to the value of our business relationship.",
          toBalanced: "If you need a higher cap for certain scenarios, we can discuss a multiplier like 2x annual fees, but maintaining equal caps for both parties ensures balanced risk allocation.",
          fromUnacceptable: "A three-month fee cap for you while we face unlimited liability creates extreme risk disparity. Our finance and risk teams cannot approve such an unbalanced arrangement."
        }
      }
    ]
  },
  {
    id: "termination",
    title: "Termination",
    description: "Clauses governing the conditions and procedures for ending the agreement.",
    clauses: [
      {
        id: "term-1",
        title: "Termination for Convenience",
        mostFavorable: "Either party may terminate this Agreement for any reason upon ninety (90) days written notice to the other party.",
        balanced: "Customer may terminate this Agreement for any reason upon sixty (60) days written notice. Provider may terminate this Agreement for any reason upon one hundred and twenty (120) days written notice.",
        acceptable: "Customer may terminate this Agreement at any time for any reason upon thirty (30) days written notice. Provider shall not have the right to terminate for convenience.",
        unacceptable: "Customer may terminate this Agreement at any time for any reason upon thirty (30) days written notice. Provider shall not have the right to terminate for convenience.",
        arguments: {
          toMostFavorable: "Mutual termination rights with equal notice periods create a balanced relationship where both parties have equal flexibility and security. This fosters better long-term partnerships based on mutual benefit rather than obligation.",
          toBalanced: "We understand you may need different notice periods for planning purposes. An asymmetric approach with longer notice from you provides us necessary transition time while giving you the security of our continued service commitment.",
          fromUnacceptable: "A one-sided termination right leaves us in a perpetual state of uncertainty. We need to make investments and resource allocations based on this relationship, which requires reasonable certainty it won't be terminated abruptly without reciprocal rights."
        }
      }
    ]
  }
];

// Add a check to verify data at module load time
console.log(`samplePlaybook contains ${samplePlaybook.length} sections`);

// Export a default as fallback in case named export isn't working
export default samplePlaybook;
