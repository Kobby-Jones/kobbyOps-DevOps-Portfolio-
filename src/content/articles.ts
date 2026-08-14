import type { Article } from "./types";

export const articles: Article[] = [
  {
    type: "blog",
    slug: "designing-offline-first-itsm-for-unreliable-networks",
    title: "Designing an Offline-First ITSM Client for Unreliable Networks",
    excerpt:
      "A practical architecture for keeping ticket creation, updates, and comments dependable when connectivity disappears mid-workflow.",
    tags: ["Offline-first", "Flutter", "ITSM", "Architecture"],
    publishedAt: "2026-08-13",
    readingMinutes: 7,
    featured: true,
    seoDescription:
      "Learn how Cobbina Emmanuel designed an offline-first Flutter ITSM client with a persistent write queue, layered services, secure storage, and automatic synchronisation.",
    content: `
Connectivity is not a detail when a service desk supports people working across different devices and locations. If a technician can open a ticket only while the network is healthy, the application has moved an infrastructure problem directly into the user's workflow.

## Start with the operation, not the screen

The important design question is not whether a page can be cached. It is whether an operation can be completed safely and understood later. In an ITSM client, that means ticket creation, status changes, and comments need durable local intent.

I separate the client into four layers:

- screens capture intent and display state;
- providers coordinate feature state;
- services own API and offline fallback behaviour;
- network and storage modules handle tokens, connectivity, cache, and the write queue.

That boundary keeps retry logic out of widgets and makes each domain easier to test.

## Queue writes with enough context to replay them

An offline queue should store more than an endpoint name. A useful record includes the operation type, local identifier, payload, creation time, retry count, and any dependency on an earlier queued action. For example, a comment created against a new offline ticket cannot synchronise before the ticket receives its server identifier.

The interface should acknowledge the local result immediately, label it as pending, and preserve it across restarts. Silent failure is worse than a visible offline state.

## Reconnect does not mean the API is ready

A device can have a network route while the backend is unreachable. Synchronisation therefore needs a real service check, bounded retries, and clear failure categories. Authentication errors, validation failures, and transient network failures should not all return to the queue in the same way.

## Resolve conflicts as a product decision

When local and remote state changed independently, "last write wins" is not automatically correct. Ticket status may require server-enforced transition rules, while a draft comment may be safe to append. The conflict policy belongs to the domain, not to a generic synchronisation helper.

## Make the queue observable

Users need to see what is saved locally, what is synchronising, and what needs attention. Engineers need structured logs around queue depth, retry outcomes, and reconciliation latency. Offline-first reliability is achieved when both the user experience and the operating model explain the same state.

The result is not merely an application that opens without a network. It is a system that protects work until the backend can accept it safely.
`,
  },
  {
    type: "insight",
    slug: "gitops-is-a-reconciliation-model",
    title: "GitOps Is a Reconciliation Model, Not Just a Deployment Tool",
    excerpt:
      "The real value of GitOps is the continuous comparison between declared and observed state, not the presence of an Argo CD dashboard.",
    tags: ["GitOps", "Kubernetes", "Argo CD", "Platform Engineering"],
    publishedAt: "2026-08-10",
    readingMinutes: 5,
    featured: true,
    content: `
It is easy to describe GitOps as "deploying from Git," but that definition misses the operating behaviour that makes the model useful.

## Declaration is only the beginning

Version-controlled Kubernetes manifests create a reviewable desired state. They show what should exist, who changed it, and how to reproduce it. That is valuable, but a repository alone does not keep a cluster correct.

The stronger property comes from reconciliation. A controller continuously compares the desired state in Git with the observed state in the cluster and reports or corrects drift.

## A dashboard is evidence, not the architecture

Argo CD's resource tree is useful because it exposes health, synchronisation, and ownership. The dashboard does not create GitOps by itself. The architecture depends on a clear source of truth, declarative resources, automated comparison, and an intentional policy for applying differences.

## Design the recovery path

A good delivery workflow makes rollback understandable. A reviewed Git change should be able to restore the previous desired state, while cluster-level failures remain visible rather than hidden behind a successful pipeline step.

## Keep responsibilities clear

Continuous integration should build, test, and publish an immutable artifact. The GitOps controller should reconcile deployment configuration. Mixing both responsibilities into a chain of remote shell commands weakens traceability and makes drift easier to introduce.

GitOps becomes valuable when it reduces the distance between what the team reviewed and what the platform is actually running.
`,
  },
  {
    type: "insight",
    slug: "idempotency-is-a-product-reliability-feature",
    title: "Idempotency Is a Product Reliability Feature",
    excerpt:
      "Safe retries are not an implementation detail in payment and workflow APIs. They are part of the promise the product makes to users.",
    tags: ["APIs", "Reliability", "Payments", "FastAPI"],
    publishedAt: "2026-08-06",
    readingMinutes: 4,
    content: `
A client retries because it did not receive a trustworthy answer. The server may still have completed the original request. That uncertainty is exactly why a payment endpoint needs an idempotency contract.

## Bind the key to the request

An idempotency key should not be reusable for a different payload. Storing a request hash with the key lets the API return a conflict when a caller accidentally changes the amount, currency, or other protected input.

## Represent in-flight work

Two matching requests can arrive before the first one finishes. A reliable design marks the key as processing, coordinates concurrent callers, and returns or waits for the same eventual result. Simply checking a completed-response cache leaves a race window.

## Replay the original outcome

Once processing completes, later retries should receive the stored status and response. A response header can make the replay visible without changing the business payload.

## Expire intentionally

Keys need a documented lifetime. A TTL prevents unlimited growth, but it also defines how long the API promises duplicate protection. That is a product and risk decision, not merely a memory optimisation.

When idempotency is designed as an explicit state machine, users can retry safely and operators can explain exactly what happened.
`,
  },
];
