# TS Web Framework Notes

```cli
sudo npm i -g parcel-bundler
parcel index.html
```

## General Idea
Within our framework, we'll have two classes:
1. Model Classes
  - handle data, used to represent Users, Blog Posts, Images, etc
2. View Classes
  - Handle HTML and events caused by the user

User class
- private data: UserProps
- get(propName: string): (string | number)
- set(update: UserProps): void
- on(eventName: string, callback: () => {})
- trigger(eventName: string): void
- fetch(): Promise
- save(): Promise


Using json-server
```cli
json-server -w db.json
```
