# Tuinue Wasichana

## Overview

In many sub-Saharan countries, school-going girls miss school due to lack of access to menstrual hygiene products. A 2016 study by the Ministry of Education found that girls from poor families miss 20% of school annually due to the lack of sanitary towels. To combat this, an organization is providing not only sanitary towels but also clean water and sanitation facilities.

## Solution

This platform enables donors to support such charities through one-time and recurring donations. It automates the donation process, enabling monthly contributions to ensure consistency in support.

## Team

* **Full Stack:** React (Frontend) & Python Flask (Backend)

## Users

* **Donor**
* **Charity**
* **Administrator**

## User Stories

### Donors can:

* View a list of charities
* Register an account
* Donate once or set up recurring donations
* Choose to remain anonymous
* Receive monthly donation reminders
* View stories about donation beneficiaries
* Donate via PayPal/Stripe or other services (TBD)

### Charities can:

* Apply for inclusion on the platform
* Manage their profile upon admin approval
* View donor information and donations
* Track total donations received
* Post stories and manage beneficiaries
* Maintain inventory for distributed items

### Administrators can:

* Review charity applications
* Approve or reject applications
* Delete charities

## Tech Stack

* **Backend:** Flask, Flask-Migrate, SQLAlchemy, Flask-RESTful, Flask-CORS, JWT, psycopg2-binary, SQLAlchemy-Serializer
* **Frontend:** React, Bootstrap

## Entity Relationship Overview

The schema includes the following tables:

* `users`
* `charities`
* `donations`
* `donation_schedules`
* `beneficiaries`
* `inventory`
* `stories`

Relationships:

* A user can donate to multiple charities.
* A charity can have many donations, schedules, beneficiaries, inventory items, and stories.

## Running the Application

### Backend:

From the root directory:

```bash
PYTHONPATH=$(pwd) python backend/app.py
```

### Frontend:

From the `frontend` directory:

```bash
npm run dev
```

---

>
