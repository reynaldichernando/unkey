// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.20.0

package database

import (
	"database/sql"
	"database/sql/driver"
	"fmt"
	"time"
)

type ApisAuthType string

const (
	ApisAuthTypeKey ApisAuthType = "key"
	ApisAuthTypeJwt ApisAuthType = "jwt"
)

func (e *ApisAuthType) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = ApisAuthType(s)
	case string:
		*e = ApisAuthType(s)
	default:
		return fmt.Errorf("unsupported scan type for ApisAuthType: %T", src)
	}
	return nil
}

type NullApisAuthType struct {
	ApisAuthType ApisAuthType
	Valid        bool // Valid is true if ApisAuthType is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullApisAuthType) Scan(value interface{}) error {
	if value == nil {
		ns.ApisAuthType, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.ApisAuthType.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullApisAuthType) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.ApisAuthType), nil
}

type WorkspacesPlan string

const (
	WorkspacesPlanFree       WorkspacesPlan = "free"
	WorkspacesPlanPro        WorkspacesPlan = "pro"
	WorkspacesPlanEnterprise WorkspacesPlan = "enterprise"
)

func (e *WorkspacesPlan) Scan(src interface{}) error {
	switch s := src.(type) {
	case []byte:
		*e = WorkspacesPlan(s)
	case string:
		*e = WorkspacesPlan(s)
	default:
		return fmt.Errorf("unsupported scan type for WorkspacesPlan: %T", src)
	}
	return nil
}

type NullWorkspacesPlan struct {
	WorkspacesPlan WorkspacesPlan
	Valid          bool // Valid is true if WorkspacesPlan is not NULL
}

// Scan implements the Scanner interface.
func (ns *NullWorkspacesPlan) Scan(value interface{}) error {
	if value == nil {
		ns.WorkspacesPlan, ns.Valid = "", false
		return nil
	}
	ns.Valid = true
	return ns.WorkspacesPlan.Scan(value)
}

// Value implements the driver Valuer interface.
func (ns NullWorkspacesPlan) Value() (driver.Value, error) {
	if !ns.Valid {
		return nil, nil
	}
	return string(ns.WorkspacesPlan), nil
}

type Api struct {
	ID          string
	Name        string
	WorkspaceID string
	IpWhitelist sql.NullString
	AuthType    NullApisAuthType
	KeyAuthID   sql.NullString
}

type Key struct {
	ID                      string
	Hash                    string
	Start                   string
	OwnerID                 sql.NullString
	Meta                    sql.NullString
	CreatedAt               time.Time
	Expires                 sql.NullTime
	RatelimitType           sql.NullString
	RatelimitLimit          sql.NullInt32
	RatelimitRefillRate     sql.NullInt32
	RatelimitRefillInterval sql.NullInt32
	WorkspaceID             string
	ForWorkspaceID          sql.NullString
	Name                    sql.NullString
	RemainingRequests       sql.NullInt32
	KeyAuthID               string
}

type KeyAuth struct {
	ID          string
	WorkspaceID string
}

type Workspace struct {
	ID                    string
	Name                  string
	Slug                  string
	TenantID              string
	Internal              bool
	StripeCustomerID      sql.NullString
	StripeSubscriptionID  sql.NullString
	Plan                  NullWorkspacesPlan
	QuotaMaxActiveKeys    sql.NullInt32
	UsageActiveKeys       sql.NullInt32
	QuotaMaxVerifications sql.NullInt32
	UsageVerifications    sql.NullInt32
	LastUsageUpdate       sql.NullTime
}
