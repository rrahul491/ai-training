import type { CourseContent, CourseModule } from "@/types/training";

type ModuleSeed = {
  title: string;
  sections: Array<[string, string]>;
  prompt: string;
  answer: string;
};

function createModules(seeds: ModuleSeed[]): CourseModule[] {
  return seeds.map((seed, moduleIndex) => ({
    title: seed.title,
    sections: seed.sections.map(([title, body], sectionIndex) => ({
      number: `${moduleIndex + 1}.${sectionIndex + 1}`,
      title,
      body,
    })),
    check: {
      prompt: seed.prompt,
      options: [
        { text: "Act immediately without checking the request.", correct: false },
        { text: seed.answer, correct: true },
        { text: "Ignore the situation and assume someone else will handle it.", correct: false },
      ],
      feedback:
        "The safest choice pauses the action, checks the evidence, and uses the approved process.",
    },
  }));
}

function createAssessment(topic: string) {
  return Array.from({ length: 8 }, (_, index) => ({
    prompt: `${topic}: which response best protects people and the organisation in scenario ${index + 1}?`,
    options: [
      {
        text: "Use the approved process, verify the situation, and report concerns promptly.",
        correct: true,
      },
      { text: "Proceed quickly because the request appears urgent.", correct: false },
      { text: "Ask an unverified contact to make the decision for you.", correct: false },
    ],
    feedback: "Safe decisions use verification, approved channels, and timely reporting.",
  }));
}

export const additionalCourses: Record<string, CourseContent> = {
  phishing: {
    title: "Recognising Phishing",
    minutes: 18,
    welcome:
      "Phishing messages try to create urgency, trust, or curiosity so that people act before checking. This course helps you pause, inspect, and report suspicious messages across email, chat, text, phone, and shared-document requests.",
    modules: createModules([
      {
        title: "Why phishing works",
        sections: [
          ["The goal of phishing", "Phishing attempts seek access, money, data, or trust."],
          [
            "Social engineering",
            "Urgency, authority, fear, and curiosity can pressure people to act.",
          ],
          [
            "Common channels",
            "Email, text, chat, phone calls, QR codes, and social media can all be used.",
          ],
          [
            "Your pause point",
            "Stop when a request changes a normal process or creates unusual pressure.",
          ],
        ],
        prompt:
          "An account-closure message gives you ten minutes to act. What is the safest first step?",
        answer: "Pause and verify the request through a trusted channel.",
      },
      {
        title: "Inspect the message",
        sections: [
          ["Sender details", "A familiar display name does not prove that an address is genuine."],
          [
            "Links",
            "Preview a destination before opening it and use trusted bookmarks when possible.",
          ],
          ["Attachments", "Unexpected files may be unsafe even when their name looks ordinary."],
          [
            "Writing clues",
            "Poor wording can be a warning, but polished writing can also be malicious.",
          ],
        ],
        prompt: "What is the strongest reason to inspect a message further?",
        answer: "The sender, link, or request does not match normal business practice.",
      },
      {
        title: "Recognise high-risk requests",
        sections: [
          ["Credentials and MFA", "Never share passwords or multi-factor authentication codes."],
          ["Payment changes", "Verify bank-detail changes through an independent known contact."],
          [
            "Impersonation",
            "Confirm unusual executive or supplier requests outside the message thread.",
          ],
          ["Data requests", "Use approved sharing rules before sending work information."],
        ],
        prompt: "A supplier asks to change bank details. What should you do?",
        answer: "Verify the change through a known independent contact.",
      },
      {
        title: "Act safely",
        sections: [
          ["Do not interact", "Avoid clicking, replying, or forwarding a suspicious message."],
          ["Report", "Use the approved reporting channel so the security team can investigate."],
          ["If you clicked", "Report promptly and follow the response team’s instructions."],
          ["Help others", "Early reporting can protect many colleagues from the same campaign."],
        ],
        prompt: "What should you do after selecting a suspicious link?",
        answer: "Report the incident promptly through the approved channel.",
      },
      {
        title: "Phishing beyond email",
        sections: [
          ["Smishing", "Unexpected text messages can carry the same pressure and fake links."],
          [
            "Vishing",
            "Verify an unexpected caller through a trusted directory or callback number.",
          ],
          ["QR lures", "Check where a QR code leads before signing in or sharing information."],
          ["Social media", "Treat work-related requests from unverified accounts with caution."],
        ],
        prompt: "An unexpected caller claims to be an executive. What is safest?",
        answer: "Verify the caller using a trusted independent contact method.",
      },
      {
        title: "Build a reporting habit",
        sections: [
          ["Pause", "Give yourself time to inspect a surprising request."],
          ["Inspect", "Check sender, destination, context, and requested action."],
          ["Report", "Use the designated reporting route when anything feels suspicious."],
          ["Protect", "One report can stop a wider incident."],
        ],
        prompt: "You are unsure whether a message is malicious. What should you do?",
        answer: "Report it through the approved channel and ask for support.",
      },
    ]),
    assessment: createAssessment("Phishing"),
  },
  "data-handling": {
    title: "Data Handling Essentials",
    minutes: 22,
    welcome:
      "Work information supports the organisation and the people it serves. This course gives you practical habits for classifying, minimising, protecting, sharing, retaining, and reporting information safely.",
    modules: createModules([
      {
        title: "Information is an asset",
        sections: [
          [
            "Why information matters",
            "Information creates value but can cause harm when mishandled.",
          ],
          [
            "Common categories",
            "Data may be public, internal, confidential, personal, regulated, or highly restricted.",
          ],
          [
            "Context matters",
            "Small details can become sensitive when combined with other information.",
          ],
          ["Accountability", "Everyone has a role in handling information safely."],
        ],
        prompt: "What should guide how you handle work information?",
        answer: "Its classification, context, and the approved policy.",
      },
      {
        title: "Classify before you share",
        sections: [
          [
            "Use the policy",
            "Check classification guidance before sending or uploading information.",
          ],
          [
            "Personal data",
            "Customer, employee, and contact details require appropriate handling.",
          ],
          [
            "Business confidential",
            "Contracts, pricing, roadmaps, and source code need controlled access.",
          ],
          [
            "Regulated data",
            "Escalate uncertainty instead of guessing about special requirements.",
          ],
        ],
        prompt: "What is the first step before sharing a customer spreadsheet?",
        answer: "Check its classification and the approved sharing method.",
      },
      {
        title: "Minimise and protect",
        sections: [
          ["Minimum necessary", "Use only the information needed to complete the task."],
          ["Redaction", "Removing details reduces risk but is not automatic approval."],
          ["Secure workspace", "Lock devices and protect paper records from unauthorised access."],
          ["Secrets", "Never place passwords, keys, or credentials in unapproved tools or files."],
        ],
        prompt: "Which approach reduces exposure in a collaboration task?",
        answer: "Use the minimum approved information required for the task.",
      },
      {
        title: "Store and share safely",
        sections: [
          ["Approved locations", "Use the correct repository, account, and access group."],
          ["Access control", "Grant access only to people with a legitimate need."],
          ["External sharing", "Check recipients, permissions, expiry, and transfer method."],
          [
            "Collaboration and AI",
            "Confirm the specific tool, account, feature, and data type are permitted.",
          ],
        ],
        prompt: "How should you send a confidential file externally?",
        answer: "Use an approved transfer method and verify recipients and permissions.",
      },
      {
        title: "Retain, dispose, and report",
        sections: [
          ["Retention", "Keep records only for the required policy or legal period."],
          ["Disposal", "Use approved deletion or destruction methods."],
          ["Mistakes", "Misaddressed messages and wrong permissions need prompt action."],
          ["Incident reporting", "Report facts quickly and avoid unapproved cleanup."],
        ],
        prompt: "What should happen after a file is sent to the wrong recipient?",
        answer: "Report it promptly and follow the approved incident process.",
      },
      {
        title: "Make safe handling routine",
        sections: [
          ["Pause before sending", "Check content, recipients, and permissions."],
          ["Ask when unsure", "Policy owners and security teams can help you decide."],
          ["Protect people", "Small daily habits prevent larger incidents."],
          ["Commitment", "Apply the minimum-necessary principle to your next task."],
        ],
        prompt: "A request for data is unclear. What should you do?",
        answer: "Pause and confirm the approved handling requirements.",
      },
    ]),
    assessment: createAssessment("Data handling"),
  },
};
