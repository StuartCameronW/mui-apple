import { useState } from "react";
import {
  Box,
  Typography,
  InputGroup,
  InputGroupRow,
  GroupedTextField,
  Select,
  MenuItem,
} from "mui-apple";

export default function Inputs() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [rights, setRights] = useState<string[]>([]);
  const [orgIds, setOrgIds] = useState<string[]>([]);
  const [locale, setLocale] = useState("");

  // Dummy error states to test error styling
  const [errors, setErrors] = useState<Record<string, string>>({});

  const rightsOptions = [
    { value: "admin", label: "Admin" },
    { value: "editor", label: "Editor" },
    { value: "viewer", label: "Viewer" },
  ];

  const availableOrgs = [
    { id: "org-1", name: "Acme Corp" },
    { id: "org-2", name: "Globex Inc" },
    { id: "org-3", name: "Initech" },
  ];

  const locales = [
    { value: "en", label: "English" },
    { value: "fr", label: "French" },
    { value: "es", label: "Spanish" },
    { value: "de", label: "German" },
  ];

  const toggleErrors = () => {
    if (Object.keys(errors).length > 0) {
      setErrors({});
    } else {
      setErrors({
        firstName: "First name is required",
        lastName: "Last name must be at least 2 characters",
        email: "Please enter a valid email address",
        rights: "At least one right must be selected",
        orgIds: "Please select an organisation",
      });
    }
  };

  const commonSelectProps = {
    variant: "minimal" as const,
    size: "small" as const,
    multiple: true,
    displayEmpty: true,
  };

  return (
    <Box sx={{ p: 4, maxWidth: 560 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        InputGroup test
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Tests InputGroup, InputGroupRow, GroupedTextField, and Select inside
        grouped rows with error handling.
      </Typography>

      <Box sx={{ mb: 3 }}>
        <button onClick={toggleErrors} style={{ cursor: "pointer" }}>
          {Object.keys(errors).length > 0 ? "Clear errors" : "Show errors"}
        </button>
      </Box>

      <InputGroup>
        <InputGroupRow
          label="First Name"
          error={!!errors.firstName}
          helperText={errors.firstName}
        >
          <GroupedTextField
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Jane"
            required
          />
        </InputGroupRow>
        <InputGroupRow
          label="Last Name"
          error={!!errors.lastName}
          helperText={errors.lastName}
        >
          <GroupedTextField
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            required
          />
        </InputGroupRow>
        <InputGroupRow
          label="Email"
          error={!!errors.email}
          helperText={errors.email}
        >
          <GroupedTextField
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
            required
          />
        </InputGroupRow>
        <InputGroupRow
          label="Rights"
          error={!!errors.rights}
          helperText={errors.rights}
        >
          <Select
            {...commonSelectProps}
            value={rights as unknown as string}
            onChange={(e: unknown) => {
              const target = (e as { target: { value: unknown } }).target;
              const vals = Array.isArray(target.value)
                ? (target.value as string[])
                : typeof target.value === "string"
                  ? [target.value]
                  : [];
              setRights(vals);
            }}
            renderValue={(selected: unknown) => {
              if (!Array.isArray(selected) || selected.length === 0) {
                return (
                  <span style={{ color: "#999" }}>Select Rights</span>
                );
              }
              return selected
                .map(
                  (val) =>
                    rightsOptions.find((o) => o.value === val)?.label ??
                    String(val)
                )
                .join(", ");
            }}
          >
            {rightsOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </Select>
        </InputGroupRow>
        <InputGroupRow
          label="Organisations"
          error={!!errors.orgIds}
          helperText={errors.orgIds}
        >
          <Select
            {...commonSelectProps}
            value={orgIds as unknown as string}
            onChange={(e: unknown) => {
              const target = (e as { target: { value: unknown } }).target;
              const vals = Array.isArray(target.value)
                ? (target.value as string[])
                : typeof target.value === "string"
                  ? [target.value]
                  : [];
              setOrgIds(vals);
            }}
            renderValue={(selected: unknown) => {
              if (!Array.isArray(selected) || selected.length === 0) {
                return (
                  <span style={{ color: "#999" }}>Select Organisations</span>
                );
              }
              return selected
                .map(
                  (val) =>
                    availableOrgs.find((o) => o.id === val)?.name ??
                    String(val)
                )
                .join(", ");
            }}
          >
            {availableOrgs.map((org) => (
              <MenuItem key={org.id} value={org.id}>
                {org.name}
              </SelectItem>
            ))}
          </Select>
        </InputGroupRow>
        <InputGroupRow label="Locale">
          <Select
            variant="minimal"
            size="small"
            value={locale}
            onChange={(e: unknown) => {
              const target = (e as { target: { value: unknown } }).target;
              setLocale(String(target.value || ""));
            }}
            displayEmpty
          >
            {locales.map((l) => (
              <MenuItem key={l.value} value={l.value}>
                {l.label}
              </SelectItem>
            ))}
          </Select>
        </InputGroupRow>
      </InputGroup>
    </Box>
  );
}
