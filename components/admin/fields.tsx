import type { FormState } from "@/app/admin/actions";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";

type FieldProps = {
  name: string;
  label: string;
  state: FormState;
  hint?: string;
  children: React.ReactNode;
};

export function Field({ name, label, state, hint, children }: FieldProps) {
  const errors = state?.fieldErrors?.[name];
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
      {hint && !errors && <p className="text-xs text-slate-500">{hint}</p>}
      {errors?.map((error) => (
        <p key={error} className="text-xs text-red-600">
          {error}
        </p>
      ))}
    </div>
  );
}

type TextFieldProps = Omit<FieldProps, "children"> & {
  defaultValue?: string | number | null;
  type?: string;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
};

export function TextField({ name, label, state, hint, defaultValue, multiline, ...input }: TextFieldProps) {
  const value = state?.values?.[name] ?? defaultValue ?? "";
  const invalid = !!state?.fieldErrors?.[name];
  return (
    <Field name={name} label={label} state={state} hint={hint}>
      {multiline ? (
        <textarea
          id={name}
          name={name}
          rows={4}
          defaultValue={value}
          aria-invalid={invalid}
          className={inputClass}
          {...input}
        />
      ) : (
        <input id={name} name={name} defaultValue={value} aria-invalid={invalid} className={inputClass} {...input} />
      )}
    </Field>
  );
}

export function SelectField({
  name,
  label,
  state,
  defaultValue,
  options,
}: Omit<FieldProps, "children"> & { defaultValue?: string; options: { value: string; label: string }[] }) {
  return (
    <Field name={name} label={label} state={state}>
      <select id={name} name={name} defaultValue={state?.values?.[name] ?? defaultValue} className={inputClass}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function CheckboxField({
  name,
  label,
  state,
  defaultChecked,
}: {
  name: string;
  label: string;
  state: FormState;
  defaultChecked: boolean;
}) {
  const checked = state?.values ? state.values[name] === "on" : defaultChecked;
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
      <input
        type="checkbox"
        name={name}
        defaultChecked={checked}
        className="size-4 rounded border-slate-300 accent-indigo-600"
      />
      {label}
    </label>
  );
}

export function FormError({ state }: { state: FormState }) {
  if (!state?.error) return null;
  return (
    <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
      <i className="bi bi-exclamation-triangle" aria-hidden /> {state.error}
    </p>
  );
}

export function SubmitButton({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-60"
    >
      {pending ? "Saqlanmoqda..." : children}
    </button>
  );
}
