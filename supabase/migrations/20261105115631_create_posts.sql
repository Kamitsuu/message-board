CREATE TABLE public.posts (
id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
name text NOT NULL,
message text NOT NULL,
created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;