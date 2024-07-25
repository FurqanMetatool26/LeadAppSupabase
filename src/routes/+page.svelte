<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms';
	import { supabaseClient } from '$lib/supabase';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
  
	export let data: PageData;
	
	console.log(data);
  
	const users = writable([]);
	const fetchUsers = async () => {
	  const { data, error } = await supabaseClient
		.from('profiles')
		.select('*');
  
	  if (error) {
		console.error('Error fetching users:', error);
	  } else {
		users.set(data);
	  }
	};
  
	onMount(() => {
	  if (data.user?.role === 'owner') {
		fetchUsers();
	  }
	});
  
	const submitLogout: SubmitFunction = async ({ cancel }) => {
	  const { error } = await supabaseClient.auth.signOut();
	  if (error) {
		console.log(error);
	  }
	  cancel();
	};
</script>
  
<main>
	<h1>SvelteKit & Supabase Auth with Role</h1>
	{#if data.session}
	  <p>Welcome, {data.session.user.email}</p>
	  {#if data.user?.role === 'owner'}
		<p>Welcome, Admin</p>
		<form action="/logout" method="POST" use:enhance={submitLogout}>
			<button type="submit" class="btn btn-primary">Logout</button>
		  </form>
		<h2>All Users</h2>
		<table>
		  <thead>
			<tr>
			  <th>ID</th>
			  <th>Email</th>
			  <th>Role</th>
			</tr>
		  </thead>
		  <tbody>
			{#each $users as user}
			  <tr>
				<td>{user.id}</td>
				<td>{user.email}</td>
				<td>{user.role}</td>
			  </tr>
			{/each}
		  </tbody>
		</table>
	  {:else if data.user?.role === 'viewer'}
		<p>Welcome, Viewer</p>
		<form action="/logout" method="POST" use:enhance={submitLogout}>
			<button type="submit" class="btn btn-primary">Logout</button>
		  </form>
	  {/if}
	{:else}
	  <p>Please login!</p>
	  <div class="auth-buttons">
		<a href="/login" class="btn btn-primary">Login</a>
	  </div>
	{/if}
</main>
  
<style>
	table {
	  width: 100%;
	  border-collapse: collapse;
	}
	th, td {
	  padding: 8px;
	  text-align: left;
	  border-bottom: 1px solid #ddd;
	}
	th {
	  background-color: #4CAF50; /* Change this color to your desired header color */
	  color: white;
	}
</style>
