<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:150'],
            'phone' => ['nullable', 'string', 'max:30'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        Mail::raw("Name: {$data['name']}\nEmail: {$data['email']}\nPhone: ".($data['phone'] ?? '')."\n\n{$data['message']}", function ($mail) use ($data) {
            $mail->to(config('mail.from.address'))->replyTo($data['email'])->subject('New website contact message');
        });

        return back()->with('success', 'Thanks. Your message has been sent.');
    }
}