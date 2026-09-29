<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscriber;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'email' => [
                'required',
                'email',
                'max:150',
            ],
        ]);

        $subscriber = NewsletterSubscriber::where(
            'email',
            $data['email']
        )->first();

        if ($subscriber) {
            if ($subscriber->is_active) {
                return back()->with(
                    'error',
                    'This email is already subscribed.'
                );
            }

            $subscriber->update([
                'is_active' => true,
                'subscribed_at' => now(),
                'unsubscribed_at' => null,
            ]);

            return back()->with(
                'success',
                'Your subscription has been reactivated.'
            );
        }

        NewsletterSubscriber::create([
            'email' => $data['email'],
            'is_active' => true,
            'subscribed_at' => now(),
        ]);

        return back()->with(
            'success',
            'Successfully subscribed to our newsletter.'
        );
    }
}