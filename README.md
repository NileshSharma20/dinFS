# din

## ToDo List
- [x] User Functions
    - [x] Activate and Deactivate Users
    - [x] Manager and Admin access to update user data
    - [x] Fix Client Side rendering after multiple user updates
    - [x] Logic for Client side disabling of multiple edit on User
    Management Panels
    - [x] Admin Manager Employee Radiobox logic

- [ ] Product Functions
    - [x] Build Product search
    - [x] Update Products patch
    - [x] Update Products in product collection logic
    - [x] Make POST /api/prod/:itemCode dynamic
    - [x] Protected Middleware
    - [x] Product Search (with Debouncing)
    - [x] Product Search (SKU)
    - [x] Individual Product Page Update
    - [x] Add Search and Add UI for Product Page Edit (Compatible Models Input)
    - [ ] Compatible Products Name logic for when searching by SKU or individual search
    - [x] Compatible Products Input Safety Logic

- [ ] Clocked Functions
    - [ ] Account for Time Differences in Server and set to IST

- [ ] Demand Slip Functions
    - [x] Create Demand Slip Database and Backend
    - [x] Create Demand Slip Backup Database
    - [x] Generate Demand Slip PDF
    - [ ] Create Day based Demand Slip Backup
    - [x] Protected Routes (Manager and Admin Access)
    - [ ] Demand Slip Panel
    - [ ] Create Frontend for New Routes

- [ ] Frontend
    - [ ] Revisit UI/UX
    - [ ] Clean logic for Input Tags in Product Search

## Product Object Structure
- itemCode {String}
- vehicleModel {String}
- brandCompany {String}
- partNum {String}
- sku {Sttring} [Auto Generated]
- mrp {String}
- qty {String} [to be added]
- compatibleModels {Array}
- metaData {Object}

## DemandSlip Object Structure
- ticketNumber {String - xxxddmmyy} [Auto Generated]
- employeeId {Mongo ObjectId} [Logged-in User ID]
- deliveryPartnerName {String}
- distributorName {String}
- status {String, default-"pending"}
- totalCost {Number, default-0}
- orderedProductList {Array}
- recievedProductList {Array}