"use client";

import { useId, useState } from "react";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Field, inputCls } from "./ui";

/** Mirrors the API's PasswordPolicy so feedback is instant; the server remains the authority. */
export const PASSWORD_MIN_LENGTH = 10;

export function passwordChecks(password: string, confirm: string) {
  return [
    {
      label: `At least ${PASSWORD_MIN_LENGTH} characters`,
      ok: password.length >= PASSWORD_MIN_LENGTH,
    },
    { label: "Contains a letter", ok: /\p{L}/u.test(password) },
    { label: "Contains a number", ok: /\d/.test(password) },
    { label: "Both entries match", ok: password.length > 0 && password === confirm },
  ];
}

export function passwordIsValid(password: string, confirm: string) {
  return passwordChecks(password, confirm).every((c) => c.ok);
}

export function PasswordInput({
  id,
  name,
  autoComplete,
  value,
  onChange,
  invalid,
  autoFocus,
}: {
  id: string;
  name: string;
  autoComplete: string;
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
  autoFocus?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        autoComplete={autoComplete}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid || undefined}
        autoFocus={autoFocus}
        className={cn(inputCls, "pr-10")}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        aria-pressed={show}
        className="text-ink-400 hover:text-ink-900 absolute inset-y-0 right-0 grid w-10 place-items-center"
      >
        {show ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
      </button>
    </div>
  );
}

/** New password + confirmation with a live checklist. */
export function NewPasswordFields({
  password,
  confirm,
  onPassword,
  onConfirm,
  error,
  autoFocus,
}: {
  password: string;
  confirm: string;
  onPassword: (v: string) => void;
  onConfirm: (v: string) => void;
  error?: string;
  autoFocus?: boolean;
}) {
  const uid = useId();
  const checks = passwordChecks(password, confirm);
  const touched = password.length > 0 || confirm.length > 0;
  return (
    <>
      <Field label="New password" htmlFor={`${uid}-new`} error={error}>
        <PasswordInput
          id={`${uid}-new`}
          name="newPassword"
          autoComplete="new-password"
          value={password}
          onChange={onPassword}
          invalid={Boolean(error)}
          autoFocus={autoFocus}
        />
      </Field>
      <Field label="Confirm new password" htmlFor={`${uid}-confirm`}>
        <PasswordInput
          id={`${uid}-confirm`}
          name="confirmPassword"
          autoComplete="new-password"
          value={confirm}
          onChange={onConfirm}
          invalid={touched && confirm.length > 0 && confirm !== password}
        />
      </Field>
      <ul className="grid gap-1 text-xs sm:grid-cols-2" aria-live="polite">
        {checks.map((c) => (
          <li
            key={c.label}
            className={cn(
              "flex items-center gap-1.5",
              c.ok ? "text-brand-700" : touched ? "text-ink-500" : "text-ink-400",
            )}
          >
            {c.ok ? (
              <Check className="size-3.5" aria-hidden />
            ) : (
              <X className="size-3.5" aria-hidden />
            )}
            {c.label}
          </li>
        ))}
      </ul>
    </>
  );
}
