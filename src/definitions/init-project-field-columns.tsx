export const InitProjectFieldColumns = (projectId: number) => {
 return [
    { ProjectFieldId: 0, Field: "TracId", TracField: "id", FieldName: "ID", Visible: false, Order: 201, ProjectId: projectId, OrgOrder:0, },
    { ProjectFieldId: 0, Field: "Summary", TracField: "summary", FieldName: "概要", Visible: false, Order: 202, ProjectId: projectId, OrgOrder:1, },
    { ProjectFieldId: 0, Field: "Status", TracField: "status", FieldName: "状態", Visible: false, Order: 203, ProjectId: projectId, OrgOrder:2, },
    { ProjectFieldId: 0, Field: "Owner", TracField: "owner", FieldName: "担当", Visible: false, Order: 204, ProjectId: projectId, OrgOrder:3, },
    { ProjectFieldId: 0, Field: "Type", TracField: "type", FieldName: "分類", Visible: false, Order: 205, ProjectId: projectId, OrgOrder:4, },
    { ProjectFieldId: 0, Field: "Priority", TracField: "priority", FieldName: "優先度", Visible: false, Order: 206, ProjectId: projectId, OrgOrder:5, },
    // { ProjectFieldId: 0, Field: "Milestone", TracField: "milestone", FieldName: "リリース", Visible: false, Order: 207, ProjectId: projectId, OrgOrder:6, },
    { ProjectFieldId: 0, Field: "Component", TracField: "component", FieldName: "機能", Visible: false, Order: 208, ProjectId: projectId, OrgOrder:6, },
    // { ProjectFieldId: 0, Field: "Version", TracField: "version", FieldName: "ver", Visible: false, Order: 209, ProjectId: projectId, OrgOrder:8, },
    { ProjectFieldId: 0, Field: "CreateTime", TracField: "time", FieldName: "作成日", Visible: false, Order: 210, ProjectId: projectId, OrgOrder:7, },
    { ProjectFieldId: 0, Field: "Changetime", TracField: "changetime", FieldName: "更新日", Visible: false, Order: 211, ProjectId: projectId, OrgOrder:8, },
    { ProjectFieldId: 0, Field: "DueAssign", TracField: "due_assign", FieldName: "開始予定", Visible: false, Order: 212, ProjectId: projectId, OrgOrder:9, },
    { ProjectFieldId: 0, Field: "DueClose", TracField: "due_close", FieldName: "終了予定", Visible: false, Order: 213, ProjectId: projectId, OrgOrder:10, },
    // { ProjectFieldId: 0, Field: "Complete", TracField: "complete", FieldName: "進捗率", Visible: false, Order: 214, ProjectId: projectId, OrgOrder:13, },
    { ProjectFieldId: 0, Field: "Reporter", TracField: "reporter", FieldName: "報告者", Visible: false, Order: 215, ProjectId: projectId, OrgOrder:11, },
    { ProjectFieldId: 0, Field: "FreeField1", TracField: "", FieldName: "自由項目1", Visible: false, Order: 216, ProjectId: projectId, OrgOrder:12, },
    { ProjectFieldId: 0, Field: "FreeField2", TracField: "", FieldName: "自由項目2", Visible: false, Order: 217, ProjectId: projectId, OrgOrder:13, },
    { ProjectFieldId: 0, Field: "FreeField3", TracField: "", FieldName: "自由項目3", Visible: false, Order: 218, ProjectId: projectId, OrgOrder:14, },
    { ProjectFieldId: 0, Field: "FreeField4", TracField: "", FieldName: "自由項目4", Visible: false, Order: 219, ProjectId: projectId, OrgOrder:15, },
    { ProjectFieldId: 0, Field: "FreeField5", TracField: "", FieldName: "自由項目5", Visible: false, Order: 220, ProjectId: projectId, OrgOrder:16, },
  ]
}